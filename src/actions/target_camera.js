export default function TargetCamera(scene, mesh) {
  return new BABYLON.ExecuteCodeAction(
    BABYLON.ActionManager.OnPickTrigger,
    () => { scene.target = mesh }
  )
}